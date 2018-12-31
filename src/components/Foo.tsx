import * as React from "react";

import * as styles from "styles/Foo.module.scss";

export interface FooProps {
    header: string;
    body: string;
}

export const Foo: React.FunctionComponent<FooProps> = (props) => (
    <div className={styles.h1}>
        <h1>{props.header}</h1>
        <p>{props.body}</p>
    </div>
);
