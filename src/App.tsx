import * as React from "react";
import * as ReactDOM from "react-dom";

import { Foo } from "components/Foo";

import "styles/App.scss";

ReactDOM.render(
    <Foo
        header={"title"}
        body={"and some text over here"}
    />,
    document.getElementById("app-goes-here")
);
