import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screen/Login";
import Dashboard from "./app/screen/Dashboard";
import { createContext, useEffect, useRef, useState } from "react";
import { User } from "firebase/auth";
import { FIREBASE_AUTH } from "./config/firebase";
import * as Notifications from "expo-notifications";
import { saveDelivery } from "./config/notification";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const GuestStack = createNativeStackNavigator();
function Guest() {
  return (
    <GuestStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <GuestStack.Screen name="Login" component={Login} />
    </GuestStack.Navigator>
  );
}

const AuthenticatedStack = createNativeStackNavigator();
function Authenticated() {
  return (
    <AuthenticatedStack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthenticatedStack.Screen name="Dashboard" component={Dashboard} />
    </AuthenticatedStack.Navigator>
  );
}

export const DeliverContext = createContext<string | null>(null);

export default function App() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [user, setUser] = useState<User | null>(null);
  const [delivery, setDelivery] = useState<string | null>(null); // [1
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        await saveDelivery(notification.request.content.data?.shipment);
        setDelivery(notification.request.content.data?.shipment);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          await saveDelivery(
            response.notification.request.content.data?.shipment
          );
          setDelivery(response.notification.request.content.data?.shipment);
        }
      );

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <DeliverContext.Provider value={delivery}>
        <NavigationContainer>
          {user ? <Authenticated /> : <Guest />}
        </NavigationContainer>
      </DeliverContext.Provider>
    </ApplicationProvider>
  );
}
