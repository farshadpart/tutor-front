import {FileContainer} from "@/src/types/common/fileContainer";
import { File, Paths } from 'expo-file-system';
import {Result} from "@/src/types/common/result";

export const saveAudio = (fileContainer: FileContainer) : Result => {
    try {
        const file = new File(Paths.document, fileContainer.fileName);

        file.write(fileContainer.content, { encoding: 'base64' });

        return { isSuccess: true };
    }    
    catch (ex) {
        console.error('Failed to save the file due to this error:', ex);
        return { isSuccess: false };
    }
}

export const getAudioFileUri = (fileName: string) : string => new File(Paths.document, fileName).uri;
