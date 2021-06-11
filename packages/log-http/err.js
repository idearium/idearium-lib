'use strict';

module.exports = (err) => {
    const { stack } = err;

    return {
        '@type':
            'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
        'message': stack
    };
};
