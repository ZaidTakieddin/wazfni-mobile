import { Container } from "@/components/Container";
import { Colors } from "@/constants/Colors";
import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "404" }} />
      <Container>
        <View style={styles.content}>
          {/* <Image
            source={require("@/assets/images/404.png")}
            style={styles.image}
            resizeMode="contain"
          /> */}
          <Text style={styles.title}>الصفحة غير موجودة</Text>
          <Text style={styles.description}>
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </Text>
          <Link href="../" style={styles.link}>
            <Text style={styles.linkText}>العودة للخلف</Text>
          </Link>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  // image: {
  //   width: 200,
  //   height: 200,
  //   marginBottom: 24,
  // },
  title: {
    fontSize: 24,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
    marginBottom: 32,
  },
  link: {
    backgroundColor: Colors.primary,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  linkText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "RZ-Reg",
  },
});
