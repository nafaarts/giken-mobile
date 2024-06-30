import { View, ActivityIndicator, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearDelivery, getDelivery } from "../../config/notification";
import { Lots, Shipment } from "../../types";
import { DeliverContext } from "../../App";

import {
  Button,
  Divider,
  Layout,
  List,
  ListItem,
  Text,
} from "@ui-kitten/components";

const Dashboard = () => {
  const auth = FIREBASE_AUTH;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const delivery = useContext(DeliverContext);

  const handleLogout = () => {
    const user = auth.currentUser;
    signOut(auth)
      .then(async () => {
        if (user) {
          const userRef = doc(FIREBASE_DB, "users", user.uid);
          await deleteDoc(userRef);
          await clearDelivery();
        }
      })
      .catch((error) => console.log("Error logging out: ", error));
  };

  const getCurrentDelivery = async () => {
    setLoading(true);
    try {
      const delivery = await getDelivery();
      console.log("Delivery: ", delivery);

      if (delivery) {
        const docRef = doc(FIREBASE_DB, "shipments", delivery);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setShipment({
            uid: docSnap.id,
            ...docSnap.data(),
          } as Shipment);
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCOnfirmDelivery = async () => {
    if (delivery === null) return;

    const updatedShipment = {
      ...shipment,
      delivery: {
        status: true,
        date: new Date().toISOString(),
        by: auth.currentUser?.displayName || "",
      },
    };

    await setDoc(doc(FIREBASE_DB, "shipments", delivery), updatedShipment, {
      merge: true,
    });

    Alert.alert("Berhasil", "Pengiriman berhasil dikonfirmasi");
    getCurrentDelivery();
  };

  useEffect(() => {
    getCurrentDelivery();
  }, [delivery]);

  const renderItem = ({
    item,
    index,
  }: {
    item: Lots;
    index: number;
  }): React.ReactElement => (
    <ListItem title={`${item.pd}`} description={`${item.qty}`} />
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3A519C" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#e8ecf4", padding: 15, gap: 10 }}
    >
      <View
        style={{ flexDirection: "row", padding: 10, backgroundColor: "#fff" }}
      >
        <Text category="h6">Selamat Datang, </Text>
        <Text category="h6" style={{ color: "#3A519C" }}>
          {auth.currentUser?.displayName}
        </Text>
      </View>

      <View style={{ flex: 1, overflow: "scroll" }}>
        {shipment ? (
          <>
            <Text category="label" style={{ marginBottom: 5 }}>
              Informasi Shipment
            </Text>
            <View
              style={{ padding: 10, backgroundColor: "#fff", marginBottom: 10 }}
            >
              <Layout
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text category="label">Tanggal: </Text>
                <Text category="s2">{shipment?.date}</Text>
              </Layout>
              <Layout
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text category="label">Ref Number: </Text>
                <Text category="s2">{shipment?.ref_number}</Text>
              </Layout>
              <Layout
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text category="label">Part Name: </Text>
                <Text category="s2">{shipment?.part_name}</Text>
              </Layout>
              <Layout
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text category="label">Part Number: </Text>
                <Text category="s2">{shipment?.part_number}</Text>
              </Layout>
              <Layout>
                <Text category="label" style={{ marginBottom: 10 }}>
                  Remarks:
                </Text>
                <Text category="s2">{shipment?.remarks}</Text>
              </Layout>
            </View>
            <Text category="label" style={{ marginBottom: 5 }}>
              Data Lots
            </Text>
            <List
              style={{
                flex: 1,
              }}
              data={shipment.lots}
              ItemSeparatorComponent={Divider}
              renderItem={renderItem}
            />
            {!shipment.delivery?.status && (
              <Button
                size="small"
                onPress={handleCOnfirmDelivery}
                style={{ marginTop: 10 }}
              >
                Konfirmasi Pengiriman
              </Button>
            )}
          </>
        ) : (
          <Text category="h6">Tidak ada pengiriman saat ini</Text>
        )}
      </View>

      <Button size="small" status="danger" onPress={handleLogout}>
        Keluar
      </Button>
    </SafeAreaView>
  );
};

export default Dashboard;
