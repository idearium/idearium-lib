'use strict';

module.exports = (err) => {
    const { context, stack } = err;

    const data = {
        '@type':
            'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
        'message': stack,
    };

    if (context) {
        data.context = context;
    }

    return data;
};
