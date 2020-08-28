import React, {useEffect} from "react";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const $ = window.$;
const ConfirmationModal = ({textToConfirm, killerFunction, close}) => {

    useEffect(() => {
        $(`#confirmation-modal`).modal('show')
    }, [])

    const hideModalAndExecuteKillerFunction = (killerFunction) => {
        $('#confirmation-modal').modal('hide')
        killerFunction();
    }
    return ((
        <div className="modal fade" id={'confirmation-modal'} data-backdrop="static" data-keyboard="false" tabIndex="-1"
             role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"
                            id="staticBackdropLabel">Confirmation</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={() => close()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <span style={{float: "left", marginRight: 30}}><FontAwesomeIcon icon={faQuestion}/></span>
                         {textToConfirm}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                                data-dismiss="modal" onClick={() => close()}>NO
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => hideModalAndExecuteKillerFunction(killerFunction)}>YES
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ));
}

export default ConfirmationModal;