import { AuthService } from 'src/app/services/auth.service';
import { AbstractControl, Validator, ValidationErrors } from '@angular/forms';

export class PhoneValidator{
    constructor(private authService: AuthService){}
    uniquePhoneValidator(control: AbstractControl) : Promise<ValidationErrors | null>{
        return new Promise((reject, resolve) => {
            this.authService.uniquePhone(control.value).subscribe((res:any) => {
                console.log()
            });
        });        
    }
}
