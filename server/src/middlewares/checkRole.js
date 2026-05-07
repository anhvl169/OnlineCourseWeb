const checkRole = (...allowedRoles) => {
    const flatRoles = allowedRoles.flat();
    
    return (req, res, next) => {

        const userRoles = req.user.roles;

        console.log('User check roles:', userRoles);

        const hasRole = flatRoles.some(role =>
            userRoles.includes(role)
        );

        if (!hasRole) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};

module.exports = { checkRole };