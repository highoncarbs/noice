const FabricDyeForm =
{
    template: "#fabric_dye_form",
    data() {
        return {
            view: true,
            form: {
                errors: [],
                id: null,
                name: null,

            },
            data: null,
            modal: false,
            edit: {
                errors: [],
                name: null,
                index: null
            },
            confirm: false,
            fileSrc: null,
            viewUpload: false
        }
    },

    delimiters: ["[[", "]]"],
    mounted() {

        this.$refs.name.focus();
    },
    methods: {
        checkData(e) {
            this.form.errors = []

            if (this.form.name) {
                return true;
            }
            if (!this.form.name) {
                this.form.errors.push('Design Number required');
            }


        },

        submitData(e) {

            var formdata = this;

            if (this.checkData()) {

                axios
                    .post('/basic_master/add/fabric_dye', this.form)
                    .then(function (response) {

                        if (response.data.success) {
                            formdata.form.name = null;

                            formdata.$buefy.snackbar.open({
                                duration: 4000,
                                message: response.data.success,
                                type: 'is-light',
                                position: 'is-top-right',
                                actionText: 'Close',
                                queue: true,
                                onAction: () => {
                                    this.isActive = false;
                                }
                            })

                        }
                        else {
                            if (response.data.message) {
                                formdata.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: response.data.message,
                                    type: 'is-light',
                                    position: 'is-top-right',
                                    actionText: 'Close',
                                    queue: true,
                                    onAction: () => {
                                        this.isActive = false;
                                    }
                                })
                            }
                        }


                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
            e.preventDefault();
        },
        getData(e) {
            const formdata = this;

            axios
                .get('/basic_master/get/fabric_dye')
                .then(function (response) {
                    console.log(response);
                    formdata.data = response['data']

                })
                .catch(function (error) {
                    console.log(error)
                });

            e.preventDefault();
        },
        editData(data, index) {
            this.edit.errors = []

            this.modal = true
            this.edit.name = data.name
            this.edit.id = data.id
            this.edit.index = index

            this.$refs.editname.focus();

        },
        saveEditData(e) {
            const formdata = this;
            let dataList = this.data;
            if (this.edit.name) {

                axios
                    .post('/basic_master/edit/fabric_dye', this.edit)
                    .then(function (response) {
                        console.log(response.data.success)

                        if (response.data.success) {
                            dataList = formdata.data.filter(function (x) { return x.id === formdata.edit.id })
                            dataList[0].name = formdata.edit.name
                            formdata.modal = !formdata.modal;

                            formdata.$buefy.snackbar.open({
                                duration: 4000,
                                message: response.data.success,
                                type: 'is-light',
                                position: 'is-top-right',
                                actionText: 'Close',
                                queue: true,
                                onAction: () => {
                                    this.isActive = false;
                                }
                            })
                        }
                        else {
                            if (response.data.message) {
                                formdata.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: response.data.message,
                                    type: 'is-light',
                                    position: 'is-top-right',
                                    actionText: 'Close',
                                    queue: true,
                                    onAction: () => {
                                        this.isActive = false;
                                    }
                                })
                            }
                        }


                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                return true;
            }


            this.edit.errors = []
            console.log(this.edit.name)

            if (this.edit.name == "") {
                this.edit.errors.push('Location required');

            }

            e.preventDefault();

        },
        deleteData(data, index) {

            let dataList = this.data;
            let formdata = this
            axios
                .post('/basic_master/delete/fabric_dye', data)
                .then(function (response) {
                    if (response.data.success) {
                        dataList.splice(index, 1)
                        formdata.$buefy.snackbar.open({
                            duration: 4000,
                            message: response.data.success,
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })
                    }
                    else {
                        formdata.$buefy.snackbar.open({
                            duration: 4000,
                            message: response.data.message,
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        }

    }
}

