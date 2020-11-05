export class Login{
    phone:number;
    otp:number;

    username: string;
    password: string;
    
    rememberMe: boolean;
    type:string = 'Website';
}

export class ForgotPassword{
    username: string;
    otp: any;


    newPassword: string;
}
