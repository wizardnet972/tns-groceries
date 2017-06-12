import { Color } from "color";
import { TextField } from "ui/text-field";

declare var NSAttributedString: any;
declare var NSDictionary: any;
declare var NSForegoundColorAttributeName: any;

export function setHintColor(args: { view: TextField, color: Color }) {
    if (args.view.android) {
        args.view.android.setHintTextColor(args.color.android);
    }
    if (args.view.ios) {
        let dictionary = new NSDictionary(
            [args.color.ios],
            [NSForegoundColorAttributeName]
        );
        args.view.ios.attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(args.view.hint, dictionary);
    }
}