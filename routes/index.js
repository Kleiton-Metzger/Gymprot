import { NavigationContainer } from "@react-navigation/native";
import DrawerRoutes from "./Drawer.routes";


export default function Routes () {
    return (
        <NavigationContainer>
            <DrawerRoutes />
        </NavigationContainer>
    );
}
