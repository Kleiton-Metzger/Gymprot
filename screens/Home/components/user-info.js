import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles";

export const UserInfo = ({ avatar, userName, location }) => (
    <View style={styles.userInfo}>
      <Image source={avatar} style={styles.avatar} />
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );