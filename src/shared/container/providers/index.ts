import { container } from "tsyringe";
import envConfig from "../../../config/envConfig";
import mailProviderConfig from "../../../config/envConfig";
import { IDateProvider } from "./dateProvider/IDateProvider";
import { DateProvider } from "./dateProvider/implementations/DateProvider";
import { TokenProvider } from "./generateToken/implementations/TokenProvider";
import { ITokenProvider } from "./generateToken/ITokenProvider";
import { IMailProvider } from "./mailProvider/iMailProvider";
import { EtherealMailProvider } from "./mailProvider/implementations/etherealMailProvider";

// The index file of container has the responsibility to serve the injections of provider classes

// this const variable is responsible to make the provider injection of each email sender, when called
// in container.registerInstance
const mailProvider = {
    ethereal: container.resolve(EtherealMailProvider)
    // AWS_SES: 
}

container.registerInstance<IMailProvider>(
    'MailProvider',
    mailProvider[envConfig.mailProvider]
)

container.registerSingleton<IDateProvider>(
    'DateProvider',
    DateProvider
)

container.registerSingleton<ITokenProvider>(
    'TokenProvider',
    TokenProvider
)