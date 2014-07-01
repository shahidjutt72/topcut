class CustomersController < ApplicationController
  before_action :set_customer, only: [:show, :edit, :update, :destroy,:update_attributes]

  # GET /customers
  # GET /customers.json
  def index
    @customers = @company.customers
    @customer = @customers.first
  end

  # GET /customers/1
  # GET /customers/1.json
  def show
  end

  # GET /customers/new
  def new
    @customer = Customer.new
  end

  # GET /customers/1/edit
  def edit
  end

  # POST /customers
  # POST /customers.json
  def create
    # @customer = Customer.new(customer_params)
    @customer = Customer.find_or_create_by_mobile_phone(customer_params[:mobile_phone])

    respond_to do |format|
      if @customer.update_attributes(customer_params)
        format.html { redirect_to @customer, notice: 'Customer was successfully created.' }
        format.json { render action: 'show', status: :created, location: @customer }
      else
        format.html { render action: 'new' }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /customers/1
  # PATCH/PUT /customers/1.json
  def update
    
    respond_to do |format|
      if @customer.update(customer_params)
        format.html { redirect_to @customer, notice: 'Customer was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  def update_attributes    
    value = params[:value]
    field_name = params[:field_name]
    eval("@customer.#{field_name}='#{value}'")
    @customer.save
    render :text => true
  end

  # DELETE /customers/1
  # DELETE /customers/1.json
  def destroy
    @customer.destroy
    respond_to do |format|
      format.html { redirect_to customers_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_customer
      @customer = Customer.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def customer_params
      params.require(:customer).permit(:name, :email, :mobile_phone, :office_phone, :home_phone, :address, :city, :state, :zip, :ountry, :user_id, :notes)
    end
end
