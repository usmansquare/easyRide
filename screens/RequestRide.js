import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useRef, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { COLORS, FONTS, SIZES, icons, images } from '../constants'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const RequestRide = ({ navigation }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)

    const _map = useRef();
    const [fromLocation, setFromLocation] = useState( {latitude:-26.207487,longitude:28.236226});
    const [toLocation, setToLocation] = useState({latitude:-26.202616,longitude:28.227718});
    const [region, setRegion] = useState(null);
    const [duaration, setDuaration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        let mapRegion = {
            latitude: (fromLocation.latitude + toLocation.latitude) / 2,
            longitude: (fromLocation.longitude + toLocation.longitude) / 2,
            latitudeDelta: Math.abs(fromLocation.latitude - toLocation.latitude) * 2,
            longitudeDelta: Math.abs(fromLocation.longitude - toLocation.longitude) * 2,
        }

        setRegion(mapRegion);
    }, []);

    const CalculateAngle = (coordinates) => {
        let startLat = coordinates[0]["latitude"];
        let startLon = coordinates[0]["longitude"];
        let endLat = coordinates[1]["latitude"];
        let endLon = coordinates[1]["longitude"]
        let dx = endLat - startLat;
        let dy = endLon - startLon;

        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    const ZoomIn = () => {
        const newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2,
        }
        setRegion(newRegion);
        _map.current.animateToRegion(newRegion, 200);
    }

    const ZoomOut = () => {
        const newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2,
        }
        setRegion(newRegion);
        _map.current.animateToRegion(newRegion, 200);

    }

    const RenderMap = () => {
        const RenderMarker = () => {
            return (
                <Marker
                    coordinate={toLocation}
                >
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: COLORS.white
                        }}
                    >
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: COLORS.primary
                            }}
                        >
                            <Image
                                source={icons.pin}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: COLORS.white
                                }}
                            />
                        </View>
                    </View>
                </Marker>
            )
        }

        const RenderCarIcon = () => {
            return (
                <Marker
                    coordinate={fromLocation}
                    anchor={{ x: 0.5, y: 0.5 }}
                    flat={true}
                    rotation={angle}
                >
                    <Image
                        source={icons.taxi_icon}
                        style={{
                            width: 40,
                            height: 40
                        }}
                    />
                </Marker>
            )
        }
        
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    ref={_map}
                    style={{ flex: 1 }}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    showsCompass={true}
                    showsMyLocationButton={true}
                    showsScale={true}
                >
                    <MapViewDirections
                        origin={fromLocation}
                        destination={toLocation}
                        apikey={"AIzaSyCc-u9f8sMzo7ETUnr2LEWt47zC9hk-r4w"}
                        strokeWidth={5}
                        strokeColor={COLORS.primary}
                        optimizeWaypoints={true}
                        onReady={result => {
                            setDuaration(result.duaration);
                            //Fit Route Into Map
                            if (!isReady) {
                                mapView.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (SIZES.width / 20),
                                        bottom: (SIZES.height / 4),
                                        left: (SIZES.width / 20),
                                        top: (SIZES.height / 8)
                                    }
                                })
                            }
                            //Repositioning The Car
                            let nextLoc = {
                                latitude: (result.coordinates[0]["latitude"]),
                                longitude: (result.coordinates[0]["longitude"])
                            }

                            if (result.coordinates.length > 2) {
                                let angle = CalculateAngle(result.coordinates);
                                setAngle(angle);
                            }
                            setFromLocation(nextLoc);
                            setIsReady(true);
                        }}
                    />
                    {RenderMarker()}
                    {RenderCarIcon()}
                </MapView>
            </View>
        )
    };

    const RenderButtons = () =>{
        return(
            <View
                style={{
                    position:"absolute",
                    bottom:SIZES.height*.35,
                    right:SIZES.padding*2,
                    justifyContent:"space-between",
                    width:60,
                    height:130,
                }}
            >
                <TouchableOpacity
                    style={{
                        width:60,
                        height:60,
                        borderRadius:30,
                        justifyContent:"center",
                        alignItems:"center",
                        backgroundColor:COLORS.white,
                    }}
                    onPress={()=> ZoomIn()}
                >
                    <Text style={{...FONTS.body1}}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width:60,
                        height:60,
                        borderRadius:30,
                        justifyContent:"center",
                        alignItems:"center",
                        backgroundColor:COLORS.white,
                    }}
                    onPress={()=> ZoomOut()}
                >
                    <Text style={{...FONTS.body1}}>-</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: appTheme?.backgroundColor
            }}
        >
            {RenderMap()}
            {RenderButtons()}
        </View>
    )
}

export default RequestRide

const styles = StyleSheet.create({})