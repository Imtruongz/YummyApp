import { useContext } from "react";
import {NavigationContainer} from '@react-navigation/native';
import BottomTab from "./BottomTab";
import AuthNavigator from "./AuthNavigator";
import { AuthContext } from "../contexts/AuthContext";
import { navigationRef } from "../utils/navigationHelper";

const NavigationRoot = () => {
    const { isSignedIn } = useContext(AuthContext);
    return (
      <NavigationContainer ref={navigationRef}>
        {isSignedIn ? <BottomTab /> : <AuthNavigator />}
      </NavigationContainer>
    );
}

export default NavigationRoot;