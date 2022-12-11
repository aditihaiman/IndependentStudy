//ESP32 WIFI 
// this tutorial was super helpful: https://techtutorialsx.com/2018/09/13/esp32-arduino-web-server-receiving-data-from-javascript-websocket-client/


#include "WiFi.h"
#include "SPIFFS.h"
#include "ESPAsyncWebServer.h"

const char* ssid = "Barnard Guest";
const char* password = "";

const int xpin = 13; // x-axis of the accelerometer
const int ypin = 2; // y-axis
const int zpin = 32; // z-axis, some pins don't work when using wifi for some reason??
const int speaker = 25;

const int sampleSize = 10;


AsyncWebServer server(80);
AsyncEventSource events("/events");



void setup(){
  // Serial port for debugging purposes
  Serial.begin(115200);
  pinMode(speaker, OUTPUT);

  if(!SPIFFS.begin()){
    Serial.println("Error while mounting SPIFFS");
    return;
  }

  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
    delay(1000);
    Serial.print(".");

  }
  Serial.println("");

  Serial.print("Connected to Wifi with IP: ");
  Serial.println(WiFi.localIP());


  server.on("/html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html");
  });

  server.serveStatic("/", SPIFFS, "/");

  events.onConnect([](AsyncEventSourceClient *client){
    if(client->lastId()){
      Serial.printf("Client reconnected! Last message ID that it got is: %u\n", client->lastId());
    }

    client->send("hello!", NULL, millis(), 1000);
  });

  server.addHandler(&events);

  server.begin();

}




void loop() {
  //events.send("data readings in the form of melody", "acc_data", millis());

  //get data from accelerometer and send in the form of scale degree
  int x = analogRead(xpin); //read from xpin
  delay(1); //
  int y = analogRead(ypin); //read from ypin
  delay(1);
  int z = analogRead(zpin); //read from zpin

  
  Serial.print(x); //print raw x value on serial monitor
  Serial.print("\t");
  Serial.print(y); //print raw y value on serial monitor
  Serial.print("\t");
  Serial.print(z); //print raw z value on serial monitor
  Serial.print("\t");
  Serial.println("");

  int note = (int) map(z, 1616, 2410, 1, 7);
  
  Serial.print("note: ");
  Serial.println(note);
  
  char toSend[16];
  itoa(note, toSend, 1);

  Serial.print("send: ");
  Serial.println(toSend);
 
  events.send(toSend, "acc_data", millis());

  delay(1000);
  
}


int ReadAxis(int axisPin) {
  long reading = 0;
  analogRead(axisPin);
  delay(1);
  for (int i = 0; i < sampleSize; i++)
  {
  reading += analogRead(axisPin);
  }
  return reading/sampleSize;
}