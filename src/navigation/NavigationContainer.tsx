import { useContext } from "react";
import {NavigationContainer} from '@react-navigation/native';
import BottomTab from "./BottomTab";
import AuthNavigator from "./AuthNavigator";
import { AuthContext } from "../contexts/AuthContext";

const NavigationRoot = () => {
    const { isSignedIn } = useContext(AuthContext);
    return (
      <NavigationContainer>
        {isSignedIn ? <BottomTab /> : <AuthNavigator />}
      </NavigationContainer>
    );
}

export default NavigationRoot;