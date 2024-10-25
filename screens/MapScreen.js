import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from "react-native-maps";

const INITIAL_REGION = {
  latitude: 13.804023,
  longitude: 109.219143,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const markers = [
  {
    name: "FPT University Quy Nhon",
    latitude: 13.80394,
    longitude: 109.219143,
  },
  // Add other markers as needed
];

export default function MapScreen() {
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const [currentRegion, setCurrentRegion] = useState(INITIAL_REGION);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}>
            <Text>Focus</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const focusMap = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION);
  };

  const onMarkerSelected = (marker) => {
    Alert.alert(marker.name);
  };

  const handleZoomIn = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta / 2,
      longitudeDelta: currentRegion.longitudeDelta / 2,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
    setCurrentRegion(newRegion);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta * 2,
      longitudeDelta: currentRegion.longitudeDelta * 2,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
    setCurrentRegion(newRegion);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        onRegionChangeComplete={(region) => setCurrentRegion(region)}
        style={{ flex: 1, height: "100%", width: "100%" }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            title={marker.name}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => onMarkerSelected(marker)}
          >
            <Callout>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 16 }}>{marker.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zoomControls: {
    position: "absolute",
    bottom: 100,
    right: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  zoomButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  zoomText: {
    color: "white",
    fontSize: 24,
  },
  backButton: {
    position: "absolute",
    bottom: 50,
    left: 10,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});
