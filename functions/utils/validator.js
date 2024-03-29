const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(emailRegEx)) return true
    else return false
}

const isEmpty = (str) => {
    if(str.trim() === '') return true
    else return false
}

exports.validateSignupData = (data) => {
    let errors = {}

    if(isEmpty(data.email)) errors.email = 'Must not be empty'
    else {
        if(!isEmail(data.email)) errors.email = 'Must be a valid email address'
    }
    if(isEmpty(data.password)) errors.password = 'Must not be empty'
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match'
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {}

    // check the fields
    if(isEmpty(data.email)) errors.email = 'Must not be empty'
    if(isEmpty(data.password)) errors.password = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.reduceUserDetails = (data) => {
    //bio website location
    let userDeatils = {}

    if(!isEmpty(data.bio.trim())) userDeatils.bio = data.bio
    if(!isEmpty(data.website.trim())) {
        if(data.website.trim().substring(0, 4) !== 'http'){
            userDeatils.website = `http://${data.website.trim()}`
        } else userDeatils.website = data.website
    }
    if(!isEmpty(data.location.trim())) userDeatils.location = data.location

    return userDeatils

}
