import { Component } from "react";

import ErrorMessage from "../error/ErrorMes";

class ErrorBounder extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, info) {
        console.log(error, info)
        this.setState({
            error: true
        })
    }

    render() {
        const { error } = this.state;

        if (error) {
            return (
                <ErrorMessage/>
            )
        }

        return this.props.children;
    }
}

export default ErrorBounder;