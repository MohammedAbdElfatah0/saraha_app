import e from "express";

export function validation(Schema) {
    return (req, res, next) => {
        const { error } = Schema.validate(req.body);
        if (error) {
            let errorMessage = error.details.map((err) => { return err.message }).join(', ');
            console.error(`Validation error: ${errorMessage}`);
            return res.status(400).json({ message: errorMessage });
        }
        next();
    };
}
