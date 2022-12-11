import { StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SIZES, COLORS, FONTS, icons, images } from '../constants';
import { LineDivider, RideModal } from '../components'
import { auth, db } from '../firebase';

const Childrens = () => {

    const [rides, setRides] = useState(null)
    const [rideInfo, setRideInfo] = useState(null)
    const [childrens, setChildrens] = useState(null)
    const [rideModal, setRideModal] = useState(false)


    useEffect(() => {
        let childrens = []
        db.collection("passengers").where("guardian", "==", auth.currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    childrens.push(doc.data())
                });
                setChildrens(childrens)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, [])

    useEffect(() => {
        if (childrens == null) return;

        setRides([])
        childrens.forEach(child => {
            db.collection('rides').where('userID', '==', child?.id).where("status", "==", "completed")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        let rideDetails = doc.data()
                        setRides((p) => [...p, {
                            childName: (child.firstName + " " + child.lastName) ?? "Not Provided",
                            childNumber: ("+92 " + child.phoneNumber) ?? "Not Provided",
                            ...rideDetails
                        }])
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        });
    }, [childrens]);

    const renderHeader = () => {
        return (
            <View
                style={{
                    marginTop: 30,
                    height: 58,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: SIZES.radius,
                    backgroundColor: COLORS.primary
                }}
            >
                {/* Label / Title */}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ ...FONTS.h1, color: COLORS.white, fontSize: 26 }}>Child Rides</Text>
                </View>
            </View>
        );
    };

    const renderContent = () => {
        return (
            rides.map((rideDetails, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        style={{ marginTop: SIZES.radius, width: SIZES.width * .94 }}
                        onPress={() => {
                            setRideInfo(rideDetails)
                            setRideModal(!rideModal)
                        }}
                    >    
                        <Text style={{ ...FONTS.h3 }}>{`${rideDetails?.bookingDate}, ${rideDetails?.bookingTime}`}</Text>
                        <View
                            style={{
                                marginTop: SIZES.radius,
                                paddingHorizontal: SIZES.radius,
                                paddingVertical: SIZES.radius,
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.white
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    source={images.banner}
                                    resizeMode='contain'
                                    style={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: SIZES.radius
                                    }}
                                />
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        marginLeft: SIZES.base
                                    }}
                                >
                                    <Text style={{ ...FONTS.h3 }}>{rideDetails?.childName}</Text>
                                    <Text style={{ ...FONTS.body3, color: COLORS.gray30 }}>{rideDetails?.childNumber}</Text>
                                </View>
                            </View>
                            <LineDivider lineStyle={{ marginVertical: SIZES.radius }} />
                            <View>

                                <View
                                    style={{ flexDirection: 'row' }}
                                >
                                    <View
                                        style={{
                                            width: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <View
                                            style={{
                                                padding: SIZES.base,
                                                borderRadius: SIZES.radius,
                                                backgroundColor: COLORS.lightyellow
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 15,
                                                    height: 15,
                                                    backgroundColor: COLORS.sceondary,
                                                    borderRadius: SIZES.radius
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ ...FONTS.body3 }}>{rideDetails?.origin?.description}</Text>
                                        {/* <Text style={{ ...FONTS.h4, color: COLORS.gray30 }}>7:45 am</Text> */}
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 5,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: SIZES.radius,
                                                height: SIZES.radius,
                                                backgroundColor: COLORS.sceondary,
                                                borderRadius: 8
                                            }}
                                        />
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ ...FONTS.body3 }}>{rideDetails?.destination?.description}</Text>
                                        {/* <Text style={{ ...FONTS.h4, color: COLORS.gray30 }}>9:45 pm</Text> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })
        )
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.gray10
            }}
        >
            {/* Header Bar */}
            {renderHeader()}

            {
                rides != null && rides?.length > 0
                    ? <ScrollView
                        style={{
                            flex: 1
                        }}
                        contentContainerStyle={{
                            paddingBottom: 120,
                            paddingHorizontal: SIZES.radius
                        }}
                    >
                        {/* Content */}
                        {renderContent()}
                    </ScrollView>
                    : <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            source={{ uri: "https://links.papareact.com/3pn" }}
                            style={{ width: 150, height: 150, resizeMode: "contain" }}
                        />
                        <Text style={{ marginTop: SIZES.radius, ...FONTS.h2 }}>
                            No Childrens Rides ...
                        </Text>
                    </View>
            }
            <RideModal
                modalVisible={rideModal}
                setModalVisible={setRideModal}
                rideInfo={rideInfo}
            />

        </View>
    )
}

export default Childrens

const styles = StyleSheet.create({})