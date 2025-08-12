import bcrypt from 'bcrypt';

export function hashPassword(password) {
    const saltRounds = process.env.SALTROUNDS;// todo env
    return bcrypt.hashSync(password, saltRounds);
}


export function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}