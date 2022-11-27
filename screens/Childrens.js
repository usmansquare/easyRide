import { StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import { SIZES, COLORS, FONTS, icons, images } from '../constants';
import { LineDivider } from '../components'

const Childrens = () => {


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
            [1,2,3].map((item, index) => {
                    return (
                        <TouchableOpacity key ={index} style={{ marginTop: SIZES.radius, width: SIZES.width * .94 }}>
                            <Text style={{ ...FONTS.h3 }}>Today, 4:30 AM</Text>
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
                                        <Text style={{ ...FONTS.h3 }}>Usman Aslam</Text>
                                        <Text style={{ ...FONTS.body3, color: COLORS.gray30 }}>Wah Cantt</Text>
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
                                            <Text style={{ ...FONTS.h3 }}>Wah Cantt</Text>
                                            <Text style={{ ...FONTS.h4, color: COLORS.gray30 }}>7:45 am</Text>
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
                                            <Text style={{ ...FONTS.h3 }}>Islamabad</Text>
                                            <Text style={{ ...FONTS.h4, color: COLORS.gray30 }}>9:45 pm</Text>
                                        </View>
                                    </View>

                                    {/* Vertical Line */}
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: '13%', left: '6.5%',
                                            width: 4,
                                            height: 30,
                                            backgroundColor: COLORS.sceondary
                                        }}
                                    >
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

            <ScrollView
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


        </View>
    )
}

export default Childrens

const styles = StyleSheet.create({})