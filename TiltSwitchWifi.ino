#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <WebSerial.h>


AsyncWebServer server(80);


const char* ssid = "Columbia University";          // Your WiFi SSID
const char* password = "";  // Your WiFi Password


// constants won't change. They're used here to set pin numbers:
const int switchPins[8] = {15, 2, 0, 4, 12, 14, 27, 26};
//const int ledPin = 13;  // the number of the LED pin
const int speaker1 = 18;
const int speaker2 = 19;

//scales
const int cMajor[8] = {262, 294, 330, 349, 392, 440, 494, 523};
const int cMinor[8] = {262, 294, 311, 349, 392, 415, 466, 523};
const int cMinorHarmonic[8] = {262, 294, 311, 349, 392, 415, 494, 523};

const int numSwitches = 8;

//PWM properties from https://community.platformio.org/t/tone-not-working-on-espressif32-platform/7587/2
const int freq = 5000;
const int ledChannel = 0;
const int resolution = 8;

// variables will change:
int switchStates[8] = {0, 0, 0, 0, 0, 0, 0, 0};



void recvMsg(uint8_t *data, size_t len){
  WebSerial.println("Received Data...");
  String d = "";
  for(int i=0; i < len; i++){
    d += char(data[i]);
  }
  WebSerial.println(d);
}


void setup() {
  // initialize the LED pin as an output:
  //pinMode(ledPin, OUTPUT);
//   initialize the pushbutton pin as an input:
  Serial.begin(115200);
  pinMode(speaker1, OUTPUT);
  pinMode(speaker2, OUTPUT);

  ledcSetup(ledChannel, freq, resolution);
  ledcAttachPin(speaker1, ledChannel);
  
  for(int i = 0; i < numSwitches; i++){
    pinMode(switchPins[i], INPUT_PULLUP);
  }


  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.printf("WiFi Failed!\n");
    return;
  }
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  // WebSerial is accessible at "<IP Address>/webserial" in browser
  WebSerial.begin(&server);
  WebSerial.msgCallback(recvMsg);
  server.begin();


}

void loop() {
  // read the state of the pushbutton value:

  for(int i = 0; i < numSwitches; i++){
    switchStates[i] = digitalRead(switchPins[i]);
//    WebSerial.print("\tSwitch ");
//    WebSerial.print(i);
//    WebSerial.print(" is: ");
//    WebSerial.print(switchStates[i]);
  }

  WebSerial.println();

  int tone1 = 0;
  for(int i = 0; i < numSwitches; i++){
    if(switchStates[i] == LOW){
      //if(tone1){
        //tone(speaker1, cMinorHarmonic[i]);
        ledcWriteTone(ledChannel, cMinorHarmonic[i]);
        tone1 = 0;
      //}
//      else{
//        tone(speaker2, cMajor[i]);
//        tone1 = 1;
//      }
    }

  }

//  delay(1000);
}
