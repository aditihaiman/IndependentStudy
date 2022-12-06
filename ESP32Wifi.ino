//ESP32 WIFI 

#include "WiFi.h"
#include "SPIFFS.h"
#include "ESPAsyncWebServer.h"

const char* ssid = "ZHUFONet";
const char* password = "MilAdi0102";

AsyncWebServer server(80);
AsyncWebSocket ws("/test");

void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){
    if(type == WS_EVT_CONNECT){
 
    Serial.println("Websocket client connection received");
 
  } else if(type == WS_EVT_DISCONNECT){
    Serial.println("Client disconnected");
    Serial.println("-----------------------");
 
  } else if(type == WS_EVT_DATA){
 
    Serial.print("Data received: ");
 
    for(int i=0; i < len; i++) {
          Serial.print((char) data[i]);
    }
 
    Serial.println();
  }
}

void setup(){
  // Serial port for debugging purposes
  Serial.begin(115200);

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

  ws.onEvent(onWsEvent);

  server.addHandler(&ws);

  server.on("/html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html");
  });

  server.begin();

}




void loop() {
}
