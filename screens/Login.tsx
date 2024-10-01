// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import React from "react";
// import { LinearGradient } from "expo-linear-gradient";
// import { Controller, useForm } from "react-hook-form";
// import { AntDesign } from "@expo/vector-icons";
// import { RadioButton } from "react-native-paper";
// import { saveLoggedUser } from "../services/userServices";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import auth from "../config/firebase";
// import { useAppDispatch } from "../hooks/reduxHooks";
// import { CommonActions, useNavigation } from "@react-navigation/native";

// const Login = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//       role: "",
//     },
//   });

//   const dispatch = useAppDispatch();
//   const navigate = useNavigation();

//   const onSubmit = async (value: {
//     email: string;
//     password: string;
//     role: string;
//   }) => {
//     try {
//       console.log(value);

//       const userCred = await signInWithEmailAndPassword(
//         auth,
//         value.email,
//         value.password
//       );

//       console.log(userCred.user.uid);
//       const isRightUser = await saveLoggedUser(
//         userCred.user.uid,
//         dispatch,
//         value.role
//       );

//       if (isRightUser) {
//         navigate.dispatch(
//           CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
//         );
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={{ flex: 1 }}>
//           <LinearGradient
//             colors={["#1e3a8a", "#1e3a8a"]}
//             style={{
//               position: "absolute",
//               left: 0,
//               right: 0,
//               top: 0,
//               height: "100%",
//             }}
//           />
//           <ScrollView
//             contentContainerStyle={{ flexGrow: 1 }}
//             bounces={false}
//             showsVerticalScrollIndicator={false}
//           >
//             <View className="pt-20">
//               <Image source={require("../assets/images/login-img.png")} />
//             </View>

//             <View className="my-8 px-5">
//               <Text className="text-white font-bold text-4xl">Hi There!</Text>
//               <Text className="text-white">Sign in to continue</Text>
//             </View>

//             {/* form */}

//             <View className="bg-white flex-1 rounded-t-3xl p-5">
//               {/* radio buttons */}
//               <View className="mb-4">
//                 <Text>Choose Your Role</Text>

//                 {/* Create a RadioButton.Group */}

//                 <Controller
//   control={control}
//   rules={{ required: true }}
//   render={({ field: { onChange, onBlur, value } }) => (
//     <RadioButton.Group onValueChange={onChange} value={value}>
//       <View className="flex flex-row justify-around">
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <RadioButton value="students" color="red" />
//           <Text>Student</Text>
//         </View>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <RadioButton value="parents" color="green" />
//           <Text>Parent</Text>
//         </View>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <RadioButton value="teachers" color="blue" />
//           <Text>Teacher</Text>
//         </View>
//       </View>
//     </RadioButton.Group>
//   )}
//   name="role"
// />

//               </View>
//               {/* radio buttons */}
//               {/* Email Input */}
//               <Text className="text-[#A5A5A5] text-sm ">Email</Text>
//               <Controller
//                 control={control}
//                 rules={{
//                   required: true,
//                 }}
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <TextInput
//                     placeholder="Enter Your Email"
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     value={value}
//                     className="border-b py-4 mb-4"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                   />
//                 )}
//                 name="email"
//               />
//               {errors.email && (
//                 <Text className="-mt-4 mb-4">This is required.</Text>
//               )}

//               {/* Password Input */}
//               <Text className="text-[#A5A5A5] text-sm ">Password</Text>
//               <Controller
//                 control={control}
//                 rules={{
//                   maxLength: 50,
//                   required: true,
//                 }}
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <TextInput
//                     placeholder="Enter Your Password"
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     value={value}
//                     className="border-b py-4 mb-4"
//                     secureTextEntry
//                   />
//                 )}
//                 name="password"
//               />
//               {errors.password && (
//                 <Text className="-mt-4 mb-4">This is required.</Text>
//               )}

//               {/* Submit Button */}
//               <TouchableOpacity
//                 onPress={handleSubmit(onSubmit)}
//                 className="relative flex flex-row justify-center rounded-3xl overflow-hidden h-[50px] items-center mt-4"
//               >
//                 <LinearGradient
//                   colors={["#2855AE", "#7292CF"]}
//                   style={{
//                     position: "absolute",
//                     left: 0,
//                     right: 0,
//                     top: 0,
//                     height: "100%",
//                   }}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 0.95, y: 0 }}
//                 />
//                 <Text className="text-white">SIGN IN</Text>
//                 <View className=" absolute right-5">
//                   <AntDesign name="arrowright" size={24} color="white" />
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// export default Login;


import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Controller, useForm } from "react-hook-form";
import { AntDesign } from "@expo/vector-icons";
import { RadioButton, Snackbar } from "react-native-paper"; // Import Snackbar
import { saveLoggedUser } from "../services/userServices";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../config/firebase";
import { useAppDispatch } from "../hooks/reduxHooks";
import { CommonActions, useNavigation } from "@react-navigation/native";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigation();

  // State for Snackbar visibility and message
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (value: { email: string; password: string; role: string }) => {
    try {
      console.log(value);

      const userCred = await signInWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      console.log(userCred.user.uid);
      const isRightUser = await saveLoggedUser(
        userCred.user.uid,
        dispatch,
        value.role
      );

      if (isRightUser) {
        navigate.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })
        );
      }
    } catch (error: any) {
      console.log(error);
      // Set error message based on the Firebase error
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "The Email or Password you entered is incorrect, please try again.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      }

      // Set error message and show the snackbar
      setErrorMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#1e3a8a", "#1e3a8a"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "100%",
            }}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View className="pt-20">
              <Image source={require("../assets/images/login-img.png")} />
            </View>

            <View className="my-8 px-5">
              <Text className="text-white font-bold text-4xl">Hi There!</Text>
              <Text className="text-white">Sign in to continue</Text>
            </View>

            {/* form */}
            <View className="bg-white flex-1 rounded-t-3xl p-5">
              {/* radio buttons */}
              <View className="mb-4">
                <Text>Choose Your Role</Text>

                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <RadioButton.Group onValueChange={onChange} value={value}>
                      <View className="flex flex-row justify-around">
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <RadioButton value="students" color="red" />
                          <Text>Student</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <RadioButton value="parents" color="green" />
                          <Text>Parent</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <RadioButton value="teachers" color="blue" />
                          <Text>Teacher</Text>
                        </View>
                      </View>
                    </RadioButton.Group>
                  )}
                  name="role"
                />
              </View>
              
              {/* Email Input */}
              <Text className="text-[#A5A5A5] text-sm ">Email</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter Your Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="border-b py-4 mb-4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
                name="email"
              />
              {errors.email && <Text className="-mt-4 mb-4">This is required.</Text>}

              {/* Password Input */}
              <Text className="text-[#A5A5A5] text-sm ">Password</Text>
              <Controller
                control={control}
                rules={{
                  maxLength: 50,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter Your Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="border-b py-4 mb-4"
                    secureTextEntry
                  />
                )}
                name="password"
              />
              {errors.password && <Text className="-mt-4 mb-4">This is required.</Text>}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className="relative flex flex-row justify-center rounded-3xl overflow-hidden h-[50px] items-center mt-4"
              >
                <LinearGradient
                  colors={["#2855AE", "#7292CF"]}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: "100%",
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.95, y: 0 }}
                />
                <Text className="text-white">SIGN IN</Text>
                <View className="absolute right-5">
                  <AntDesign name="arrowright" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Snackbar */}
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            action={{
              label: "OK",
              onPress: () => {
                setSnackbarVisible(false);
              },
            }}
            style={{
              backgroundColor:"#002749"
            }}
          >
            {errorMessage}
          </Snackbar>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
