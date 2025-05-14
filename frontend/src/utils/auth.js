import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        console.log(token);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function logoutUser(navigate) {
    try {
        await signOut(auth);
        localStorage.removeItem("userRole");
        navigate("/")
    } catch (error) {
        throw new Error(error.message);
    }
}
