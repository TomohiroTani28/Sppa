// src/app/(common)/search/components/MapView.tsx
"use client";
import { useLocationService } from "@/app/(common)/components/LocationService";
import { useFetchTherapistLocations } from "@/hooks/api/useFetchTherapistLocations";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import React, { useEffect, useRef, useState } from "react";

// Types for map objects
interface TherapistMarkerProps {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

// Default location (Bali, Indonesia)
const DEFAULT_LOCATION = {
  lat: -8.4095,
  lng: 115.1889,
};

// Fallback data in case API fails
const FALLBACK_THERAPISTS: TherapistMarkerProps[] = [
  {
    id: "fallback-1",
    name: "サンプルセラピスト1",
    location: { ...DEFAULT_LOCATION },
  },
  {
    id: "fallback-2",
    name: "サンプルセラピスト2",
    location: {
      lat: DEFAULT_LOCATION.lat + 0.01,
      lng: DEFAULT_LOCATION.lng + 0.01,
    },
  },
];

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [olMap, setOlMap] = useState<Map | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [mapLoadError, setMapLoadError] = useState<boolean>(false);
  const { userLocation } = useLocationService();

  const { therapistLocations = [], loading, error } = useFetchTherapistLocations();

  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupContent, setPopupContent] = useState<React.ReactNode | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  // マーカーを追加する関数
  const addTherapistMarkers = (
    map: Map,
    locations: TherapistMarkerProps[],
    source: VectorSource
  ) => {
    locations.forEach((therapist) => {
      if (
        !therapist.location ||
        typeof therapist.location.lat !== "number" ||
        typeof therapist.location.lng !== "number"
      ) {
        return;
      }

      try {
        const markerFeature = new Feature({
          geometry: new Point(fromLonLat([therapist.location.lng, therapist.location.lat])),
          name: therapist.name || "不明なセラピスト",
          id: therapist.id,
        });
        source.addFeature(markerFeature);
      } catch (err) {
        console.error("Error adding marker for therapist:", therapist.id, err);
      }
    });
  };

  // Map initialization
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!isMounted || !mapRef.current || olMap) return;

      try {
        // 確実に数値型を割り当てるために型アサーションを使用
        const centerLat: number = userLocation?.lat !== undefined 
          ? userLocation.lat 
          : DEFAULT_LOCATION.lat;
        
        const centerLng: number = userLocation?.lng !== undefined 
          ? userLocation.lng 
          : DEFAULT_LOCATION.lng;
        
        // 型を明示的に示す
        const center = fromLonLat([centerLng, centerLat] as [number, number]);

        const map = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center,
            zoom: 10,
          }),
        });

        // Add click handler
        map.on("click", (event) => {
          // pixel値が確実に配列であることを確認してからアクセス
          const pixel = event.pixel || [0, 0];
          
          // 型アサーションを使用して明示的に数値であることを示す
          const topPosition = pixel[1] !== undefined ? pixel[1] : 0;
          const leftPosition = pixel[0] !== undefined ? pixel[0] : 0;
          
          setPopupPosition({ 
            top: topPosition, 
            left: leftPosition 
          });

          const feature = map.forEachFeatureAtPixel(pixel, (f: any) => f);
          if (!feature) {
            setSelectedTherapist(null);
            setPopupContent(null);
            return;
          }

          const therapistId = feature.get("id");
          const therapistName = feature.get("name");
          if (!therapistId) return;

          setSelectedTherapist(therapistId);
          setPopupContent(
            <div className="bg-white shadow-md rounded p-3 absolute z-10">
              <h3 className="font-bold text-sm">{therapistName}</h3>
              <div className="mt-1">
                <a
                  href={`/tourist/therapists/${therapistId}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  詳細を見る
                </a>
              </div>
            </div>
          );
        });

        // Add therapist markers
        const locationsToUse = therapistLocations.length > 0 ? therapistLocations : FALLBACK_THERAPISTS;
        const markersSource = new VectorSource();
        const markersLayer = new VectorLayer({
          source: markersSource,
          style: (feature) =>
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: "/images/marker-icon.png",
                scale: 0.8,
                size: [25, 41],
              }),
              text: new Text({
                text: feature.get("name"),
                offsetY: -20,
                fill: new Fill({ color: "#333" }),
                stroke: new Stroke({ color: "#fff", width: 2 }),
                font: "12px Roboto,sans-serif",
              }),
            }),
        });
        map.addLayer(markersLayer);
        addTherapistMarkers(map, locationsToUse, markersSource);

        if (isMounted) setOlMap(map);
      } catch (err) {
        console.error("Error initializing map:", err);
        if (isMounted) setMapLoadError(true);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (olMap) olMap.setTarget(undefined);
    };
  }, [olMap, userLocation, therapistLocations]);

  // Handle outside click to close popup
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedTherapist(null);
        setPopupContent(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Update map center when user location changes
  const updateMapCenter = () => {
    if (!olMap || !userLocation) return;

    // 確実に数値型を使用する
    const lat: number = userLocation.lat !== undefined 
      ? userLocation.lat 
      : DEFAULT_LOCATION.lat;
    
    const lng: number = userLocation.lng !== undefined 
      ? userLocation.lng 
      : DEFAULT_LOCATION.lng;
    
    const center = fromLonLat([lng, lat] as [number, number]);
    olMap.getView().animate({ center, duration: 1000 });
  };

  useEffect(() => {
    updateMapCenter();
  }, [userLocation, olMap]);

  // Handle current location button click
  const handleGoToCurrentLocation = () => {
    if (!olMap || !userLocation) return;
    
    // 確実に数値型を使用する
    const lat: number = userLocation.lat !== undefined 
      ? userLocation.lat 
      : DEFAULT_LOCATION.lat;
    
    const lng: number = userLocation.lng !== undefined 
      ? userLocation.lng 
      : DEFAULT_LOCATION.lng;
    
    const center = fromLonLat([lng, lat] as [number, number]);
    olMap.getView().animate({ center, zoom: 12, duration: 1000 });
  };

  if (loading && !olMap) {
    return (
      <div className="flex justify-center items-center h-80 bg-gray-50 rounded-md">
        <div className="text-gray-500">地図をロード中...</div>
      </div>
    );
  }

  if (mapLoadError || (error && therapistLocations.length === 0)) {
    return (
      <div className="flex justify-center items-center h-80 bg-gray-50 rounded-md">
        <div className="text-red-500">
          地図の読み込みに失敗しました。再度お試しください。
          <button
            className="ml-2 text-blue-500 underline"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-96 rounded-md shadow-md overflow-hidden"
        style={{ minHeight: "400px" }}
      />
      {popupContent && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
          }}
        >
          {popupContent}
        </div>
      )}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          onClick={handleGoToCurrentLocation}
          aria-label="現在地に移動"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapView;