import { TUTORAPI } from "@/src/constants/addresses";
import { interpret } from '@/src/services/interpreter';
import { Result } from '@/src/types/common/result';
import { fetchWithTimeout } from '@/src/utilities/httpUitlities';
import { log } from '@/src/services/logService';
import { getValidToken } from "@/src/services/tokenService";
import {UserSettings} from "@/src/types/account/userSettings";

const getUserSettingsEndpoint = "/userSettings/get";
const updateUserSettingsEndpoint = "/userSettings/update";

export const getUserSettings = async (): Promise<Result<UserSettings>> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}${getUserSettingsEndpoint}`, {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getValidToken()}`,
            }
        });

        return await interpret<UserSettings>(response);
    } catch (e) {
        log("Error", 'Failed to retrieve userSettings. Endpoint: {endpoint}', [
            getUserSettingsEndpoint
        ], e);
        return { isSuccess: false, error: "Something went wrong!" }
    }
}

export const update = async (userSettings: UserSettings): Promise<Result> => {
    try {
        const response = await fetchWithTimeout(`${TUTORAPI}${updateUserSettingsEndpoint}`, {
            method: "PUT",
            body: JSON.stringify(userSettings),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getValidToken()}`,
            }
        });
        
        return { isSuccess: true };
    } catch (e) {
        log("Error", 'Failed to call updateUserSettings Endpoint. UserSettings: {@UserSettings}', [userSettings], e);
        return { isSuccess: false, error: "Something went wrong!" };
    }
};
