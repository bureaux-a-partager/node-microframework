import * as express from "express";
import { Container } from "../core/container";

export function QueryParam(...getArgs) {

    let aName = getArgs[0];
    let options = getArgs[1];
    let isNullable = options.nullable || false;
    let defaultValue = options.default || null;
    let requirements = options.requirements || null;

    return function validator(target, name, descriptor) {
        let oldValue = descriptor.value;

        descriptor.value = (req, res) => {

            // param not nullable and null => error
            if (!isNullable && !req.query[aName]) {
                return res.status(400).json({
                    error: "parameter " + aName + " is required"
                });
            }

            // param not empty and not valid => error
            if (requirements) {
                let regex = new RegExp(requirements, "g");
                if (req.query[aName] && !regex.test(req.query[aName])) {
                    return res.status(400).json({
                        error: "parameter " + aName + " should match " + requirements
                    });
                }
            }

            // isNullable and null => default value
            if (isNullable && !req.query[aName]) {
                req.query[aName] = defaultValue;
            }

            return oldValue(req, res);
        };
    };
}
