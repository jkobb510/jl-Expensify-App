import {EmitterSubscription, Keyboard} from 'react-native';
import getOperatingSystem from '@libs/getOperatingSystem';
import * as Composer from '@userActions/Composer';
import CONST from '@src/CONST';
import SetShouldShowComposeInputKeyboardAware from './types';

let keyboardEventListener: EmitterSubscription | null = null;
// On iOS is visible delay with displaying input after keyboard has been closed with `keyboardDidHide` event
// Because of that - on iOS we can use `keyboardWillHide` that is not available on android
const keyboardEvent = getOperatingSystem() === CONST.OS.IOS ? 'keyboardWillHide' : 'keyboardDidHide';

const setShouldShowComposeInputKeyboardAware: SetShouldShowComposeInputKeyboardAware = (shouldShow) => {
    if (keyboardEventListener) {
        keyboardEventListener.remove();
        keyboardEventListener = null;
    }

    if (!shouldShow) {
        Composer.setShouldShowComposeInput(false);
        return;
    }

    // If keyboard is already hidden, we should show composer immediately because keyboardDidHide event won't be called
    if (!Keyboard.isVisible()) {
        Composer.setShouldShowComposeInput(true);
        return;
    }

    keyboardEventListener = Keyboard.addListener(keyboardEvent, () => {
        Composer.setShouldShowComposeInput(true);
        keyboardEventListener?.remove();
    });
};

export default setShouldShowComposeInputKeyboardAware;
