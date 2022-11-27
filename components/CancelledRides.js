import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React from 'react'
import { COLORS, FONTS, images, SIZES, icons } from '../constants'
import { LineDivider } from '../components'


const CancelledRides = () => {
	return (
		<FlatList
			data={[1, 2]}
			renderItem={() => {
				return (
					<View style={{ marginTop: SIZES.radius, width: SIZES.width * .94 }}>
						<Text style={{ ...FONTS.h3 }}>Today, 4:30 AM</Text>
						<View
							style={{
								marginTop: SIZES.radius,
								paddingHorizontal: SIZES.base,
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
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
										marginLeft: SIZES.base
									}}
								>
									<View style={{}}>
										<Text style={{ ...FONTS.h3 }}>Usman Aslam</Text>
										<Text style={{ ...FONTS.body3, marginTop: 5, color: COLORS.gray30 }}>Wah Cantt</Text>
									</View>
									<View style={{}}>
										<Text style={{ ...FONTS.h4 }} >Cost</Text>
										<Text style={{ ...FONTS.body3, marginTop: 5, color: COLORS.gray30 }}>$1.00</Text>
									</View>
									<View style={{}}>
										<Text style={{ ...FONTS.h4 }}>Time</Text>
										<Text style={{ ...FONTS.body3, marginTop: 5, color: COLORS.gray30 }}>23:00 min</Text>
									</View>
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
					</View>
				)
			}}
		/>

	)
}

export default CancelledRides

const styles = StyleSheet.create({})