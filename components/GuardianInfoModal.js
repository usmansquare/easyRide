import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SIZES, FONTS, COLORS, icons, images } from '../constants'
import { auth, db } from '../firebase'

const GuardianInfoModal = ({
    modalVisible, setModalVisible, setGuardian, personalInFo, setPersonalInFo, handleVisibility
}) => {

    const [guardians, setGuardians] = useState(null)

    useEffect(() => {
        setGuardians([])
        db.collection("passengers")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setGuardians((prev) => {
                        return [
                            ...prev,
                            doc.data()
                        ]
                    })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{
                padding: SIZES.radius,
                flexDirection: "row",
                alignItems: 'center'
            }}
            onPress={() => {
                setModalVisible(false)
                setGuardian(item)
                setPersonalInFo({
                    ...personalInFo,
                    "guardian": item.id
                })
                handleVisibility()
            }}
        >
            <Image
                source={images.banner}
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: SIZES.radius,
                    marginRight: 10
                }}
            />
            <Text style={{ ...FONTS.body3, color: COLORS.black }}>{`${item?.firstName} ${item?.lastName}`}</Text>
        </TouchableOpacity>
    )

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
        >
            <TouchableWithoutFeedback
                onPress={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", marginBottom: SIZES.width * 0.2 }}>
                    <View
                        style={{
                            height: 400,
                            width: SIZES.width * 0.8,
                            backgroundColor: COLORS.additionalColor9,
                            opacity: .95,
                            borderRadius: SIZES.radius
                        }}
                    >
                        {
                            guardians?.length > 0 && guardians != null ?
                                <FlatList
                                    data={guardians}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => `guardian-${index}`}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        marginBottom: SIZES.padding,
                                        padding: SIZES.padding
                                    }}
                                />
                                : <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image
                                        source={icons.guardian}
                                        resizeMode="contain"
                                        style={{
                                            width: SIZES.width * .8,
                                            height: SIZES.height * .5
                                        }}
                                    />
                                    <Text style={{ marginTop: SIZES.radius, ...FONTS.h3, fontSize: 18 }}>
                                        You don't have any guardian
                                    </Text>
                                </View>
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>

        </Modal>
    )
}

export default GuardianInfoModal

const styles = StyleSheet.create({})