#include <WiFi.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include "config.h"

// Define a struct for RGB LED
struct RGBLed {
  int powerPin;
  int redPin;
  int greenPin;
  int bluePin;
};

WiFiClient client;

// Buzzer and LED Pins
const int buzzerPin = 23; // Pin for buzzer switch

const RGBLed leds[3] = {
  {0, 4, 2, 15},   // RGB LED 1
  {18, 19, 5, 17},  // RGB LED 2
  {27, 14, 26, 25}   // RGB LED 3
};

const int ledCount = sizeof(leds) / sizeof(leds[0]);

// State to keep track of button press
bool buzzerPressed = false;
volatile bool connectedToWiFi = false;
volatile bool connectedToServer = false;

void setup() {
  Serial.begin(115200);
  pinMode(buzzerPin, INPUT_PULLUP);

  // Initialize LED pins as outputs
  for (const RGBLed &led : leds) {
    pinMode(led.powerPin, OUTPUT);
    analogWrite(led.powerPin, 255);
    pinMode(led.redPin, OUTPUT);
    pinMode(led.greenPin, OUTPUT);
    pinMode(led.bluePin, OUTPUT);
  }

  // Turn off all LEDs initially
  setAllLEDs(0, 0, 0);

  // Start WiFi and server connection sequence
  connectToWiFi();
  connectToServer();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
  
  if (!client.connected()) {
    connectToServer();
  }

  if (client.connected()) {
    if (client.available()) {
      String command = client.readStringUntil('\n');
      Serial.print("Received command: ");
      Serial.println(command);

      if (command.startsWith("LED")) {
        int r = command.substring(4, 7).toInt(); // Invert value for common anode
        int g = command.substring(8, 11).toInt(); // Invert value for common anode
        int b = command.substring(12, 15).toInt(); // Invert value for common anode
        
        if (command.length() > 15) {
          // If command length is greater than expected, assume it's for individual LEDs
          int ledIndex = command.substring(16, 17).toInt(); // Get the LED index
          setSingleLED(ledIndex, r, g, b);
        } else {
          // Set all LEDs
          setAllLEDs(r, g, b);
        }
      }
    }

    // Check for buzzer press
    int buzzerState = digitalRead(buzzerPin);
    if (buzzerState == LOW && !buzzerPressed) {
      // Buzzer was pressed, send event
      client.println("BUZZ");
      Serial.println("Buzzer pressed");
      buzzerPressed = true; // Mark as pressed
    }

    if (buzzerState == HIGH) {
      // Button is released, reset the state
      buzzerPressed = false;
    }
  }
}

void setAllLEDs(int r, int g, int b) {
  for(int i = 0; i < ledCount; i++) {
    setSingleLED(i, r, g, b);
  }
}

void setSingleLED(int ledIndex, int r, int g, int b) {
  analogWrite(leds[ledIndex].redPin, 255 - r);
  analogWrite(leds[ledIndex].greenPin, 255 - g);
  analogWrite(leds[ledIndex].bluePin, 255 - b);
}

void connectToWiFi() {
  connectedToWiFi = false;
  // Create a task for LED status indication
  xTaskCreate(
    LEDTaskConnectWifi,       // Task function
    "LED Task Connect WiFi",  // Name of the task
    2048,                     // Stack size
    NULL,                     // Parameter
    1,                        // Priority
    NULL                      // Task handle
  );

  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  connectedToWiFi = true;

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void LEDTaskConnectWifi(void * parameter) {
  while (!connectedToWiFi) {
    // Indicate WiFi connection status
    for (int i = 0; i < ledCount; i++) {
      setSingleLED(i, 255, 0, 0); // Red
      delay(200);
      if (connectedToWiFi)
        break;
      setSingleLED(i, 0, 0, 0);
    }
  }

  setAllLEDs(0, 0, 0);
  vTaskDelete(NULL); // Delete the task when done
}

void connectToServer() {
  connectedToServer = false;
  xTaskCreate(
    LEDTaskConnectServer,       // Task function
    "LED Task Connect Server",  // Name of the task
    2048,                     // Stack size
    NULL,                     // Parameter
    1,                        // Priority
    NULL                      // Task handle
  );
  while (!client.connect(SERVER_HOST, SERVER_PORT)) {
    if (WiFi.status() != WL_CONNECTED) {
      connectedToServer = true;
      connectToWiFi();
    }
    Serial.println("Connection to host failed");
  }
  Serial.println("Connected to server");
  connectedToServer = true;
}

void LEDTaskConnectServer(void * parameter) {
  while (!connectedToServer) {
    // Indicate WiFi connection status
    for (int i = 0; i < ledCount; i++) {
      setSingleLED(i, 0, 0, 255); // Red
      delay(200);
      if (connectedToServer)
        break;
      setSingleLED(i, 0, 0, 0);
    }
  }

  setAllLEDs(0, 0, 0);
  vTaskDelete(NULL); // Delete the task when done
}
