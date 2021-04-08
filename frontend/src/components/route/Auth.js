export const hasRole = (user, roles) => {
    try {
        const allow = roles.some(role => user.roles.includes(role))
        return allow;
    } catch (error) {

    }
}




