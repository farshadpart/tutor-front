import type { ExpoConfig } from "expo/config";

const buildNumber = Number(process.env.BUILD_NUMBER ?? 1);

const config: ExpoConfig = {
    name: "Tutor",
    slug: "Tutor",
    version: `1.0.${buildNumber}`,
    orientation: "portrait",
    icon: "./assets/images/tutor-icon-light.png",
    scheme: "tutor",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
        supportsTablet: true,
    },

    android: {
        edgeToEdgeEnabled: true,
        permissions: [
            "android.permission.RECORD_AUDIO",
            "android.permission.MODIFY_AUDIO_SETTINGS",
        ],
        package: "com.farshadpart.Tutor",
        versionCode: buildNumber,
    },

    plugins: [
        [
            "expo-splash-screen",
            {
                backgroundColor: "#ffffff",
                image: "./assets/images/tutor-icon-light.png",
                dark: {
                    image: "./assets/images/tutor-icon-dark.png",
                    backgroundColor: "#000000",
                },
                imageWidth: 200,
            },
        ],
        [
            "expo-build-properties",
            {
                android: {
                    enableProguardInReleaseBuilds: true,
                    enableShrinkResourcesInReleaseBuilds: true,
                },
            },
        ],
        [
            "expo-audio",
            {
                microphonePermission:
                    "Allow $(PRODUCT_NAME) to access your microphone.",
            },
        ],
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/tutor-icon-dark.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#ffffff",
                dark: {
                    backgroundColor: "#000000",
                },
            },
        ],
        "expo-secure-store",
        "expo-build-properties",
        "expo-web-browser",
        "expo-asset",
        "expo-font",
    ],

    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },

    extra: {
        router: {},
        eas: {
            projectId: "87161cd4-16d6-4525-8d6f-ee82717a783d",
        },
    },
};

export default config;
