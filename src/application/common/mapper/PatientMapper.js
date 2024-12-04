export function mapToDomain(data) {
    const domain = {};

    if (data.googleId) domain.googleId = data.googleId;
    if (data.firstName) domain.firstName = data.firstName;
    if (data.lastName) domain.lastName = data.lastName;
    if (data.email) domain.email = data.email;
    if (data.phone) domain.phone = data.phone;
    if (data.dob) domain.dob = new Date(data.dob);
    if (data.city) domain.city = data.city;
    if (data.state) domain.state = data.state;
    if (data.country) domain.country = data.country;
    if (data.password) domain.password = data.password;
    if (data.profilePicture) domain.profilePicture = data.profilePicture;
    if (data.careRequired) domain.careRequired = data.careRequired;
    if (data.isPublic !== undefined) domain.isPublic = Boolean(data.isPublic);
    if (data.isVerified !== undefined) domain.isVerified = Boolean(data.isVerified);
    if (data.verificationToken) domain.verificationToken = data.verificationToken;
    if (data.resetOtpExpiry) domain.resetOtpExpiry = new Date(data.resetOtpExpiry);
    if (data.isDeleted !== undefined) domain.isDeleted = Boolean(data.isDeleted);

    // return new Patient(domain);
    return domain;
}



export function mapToDto(data) {
    const dto = {};
    if(data){
        if (data?._id) dto.id = data._id.toString();
        if (data?.googleId) dto.googleId = data.googleId;
        if (data.firstName) dto.firstName = data.firstName;
        if (data.lastName) dto.lastName = data.lastName;
        if (data.email) dto.email = data.email;
        if (data.phone) dto.phone = data.phone;
        if (data.dob) dto.dob = new Date(data.dob);
        if (data.city) dto.city = data.city;
        if (data.state) dto.state = data.state;
        if (data.country) dto.country = data.country;
        if (data.profilePicture) dto.profilePicture = data.profilePicture;
        if (data.careRequired) dto.careRequired = data.careRequired;
        if (data.isPublic !== undefined) dto.isPublic = Boolean(data.isPublic);
        if (data.isVerified !== undefined) dto.isVerified = Boolean(data.isVerified);
        if (data.isDeleted !== undefined) dto.isDeleted = Boolean(data.isDeleted);
        dto.userType = "Patient";
    }

    return dto;
}
