export class AppointmentDetails {
    appointment_date: string;
    booking_id: string;
    consultation_type: string;
    approx_time: number;
    doctor: {
        doctor_detail:{
            department:{
                name: string;
            };
            department_id: number;
            designation: string;
            doctor_id: number;
        }
        name: string;
        phone: string;
        ref_id: string;
    };
    doctor_id: number;
    isConfirmed: boolean;
    isPaid: boolean;
    isSelfBooking: boolean;
    other_patient_name: null;
    other_patient_phone: null;
    patient: {
        name: string;
        phone: string;
        ref_id: string
    };
    patient_id: number;
    payment: {
        amount: number;
    };
    slot_id: number;
    status: string;
    token: number;
}