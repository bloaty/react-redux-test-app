import * as React from "react";

export interface FooProps {
    header: string;
    body: string;
}

export const Foo: React.FunctionComponent<FooProps> = (props) => {
    return (
        <>
            <h1>{props.header}</h1>
            <p>{props.body}</p>
        </>
    );
};
