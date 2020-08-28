import React, {Component} from "react";

const $ = window.$;

export default class Toast extends Component {


    constructor(props) {
        super(props);
        this.state = {data: props.dataToast.result, style: props.dataToast.style}

    }

    componentDidMount() {
        this.toastBehavior();
    }

    toastBehavior() {
        $(`.toast`).toast({animation: true, delay: 20000});
        $(`.toast`).toast('show');

        $(`.toast`).on('hide.bs.toast', () => {
            this.props.removeToast()
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataToast !== this.props.dataToast) {

            this.setState(() => {
                return {data: this.props.dataToast.result, style: this.props.dataToast.style}
            });
            this.toastBehavior();
        }
    }


    render() {

        return (
            <div aria-live="polite" aria-atomic="true"  style={{position: 'absolute', top: 0, right: 0}}>
                <div>
                    <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="mr-auto">Result Action</strong>
                            <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="toast-body" style={this.state.style}>
                            {this.state.data}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}