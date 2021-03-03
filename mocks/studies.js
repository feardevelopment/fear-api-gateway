
const availableStudies = ['Computer Science Engineering', 'b', 'c', 'd']

module.exports = {
    name: "studies",
    actions: {

        /**
         * studies.getAvailableTrainings
         * endpoint: GET /studies/trainings/available
         */
        getAvailableTrainings(ctx) {
            return availableStudies
        }
    }
};