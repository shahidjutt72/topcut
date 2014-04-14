class CompaniesController < ApplicationController
  before_action :set_company, only: [:show, :edit, :update, :destroy,:add_staff,:add_services]
  before_filter :login_necessary

  # GET /companies
  # GET /companies.json
  def index
    @companies = Company.all
  end

  # GET /companies/1
  # GET /companies/1.json
  def show
  end

  def add_staff
    @staff = @company.staffs
  end

  def add_services
    @services = @company.services
  end  

  # GET /companies/new
  def new
    @company = Company.new
    @timing = @company.build_timing
  end

  # GET /companies/1/edit
  def edit
    @timing = @company.timing
  end

  # POST /companies
  # POST /companies.json
  def create
    
    # @company = Company.new(company_params)    
    @company = current_user.build_company(company_params)    
    respond_to do |format|
      if @company.save
        format.html { redirect_to add_services_company_path(@company), notice: 'Company was successfully created.' }
        format.json { render action: 'show', status: :created, location: @company }
      else
        format.html { render action: 'new' }
        format.json { render json: @company.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /companies/1
  # PATCH/PUT /companies/1.json
  def update
    respond_to do |format|
      if @company.update_attributes(company_params)
        if params[:from_staff_page]
          format.html { redirect_to add_services_company_path(@company), notice: 'Company was successfully updated.' }
          format.json { head :no_content }
        elsif params[:from_services_page]
          format.html { redirect_to "/", notice: 'successfully added all the information!' }
          format.json { head :no_content }
        else
          format.html { redirect_to @company, notice: 'Company was successfully updated.' }
          format.html { redirect_to @company, notice: 'Company was successfully updated.' }
        end  
      else
        format.html { render action: 'edit' }
        format.json { render json: @company.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /companies/1
  # DELETE /companies/1.json
  def destroy
    @company.destroy
    respond_to do |format|
      format.html { redirect_to companies_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_company
      @company = Company.find(params[:id])
    end

    def login_necessary
      if !current_user
        redirect_to "/", :notice =>"Please sign in first!"
      end  
    end  

    # Never trust parameters from the scary internet, only allow the white list through.
    def company_params
      params.require(:company).permit(:id,:name, :business_type, :user_id, :timing_attributes =>[:sun_opening_time, :sun_closing_time, :is_on_sun, :mon_opening_time, :mon_closing_time, :is_on_mon, :tue_opening_time, :tue_closing_time, :is_on_tue, :wed_opening_time, :wed_closing_time, :is_on_wed, :thu_opening_time, :thu_closing_time, :is_on_thu, :fri_opening_time, :fri_closing_time, :is_on_fri, :sat_opening_time, :sat_closing_time, :is_on_sat, :company_id], :staffs_attributes =>[:name, :email, :phone, :id], :services_attributes =>[:name, :service_time, :cost, :id, :staffs_attributes =>[:staff_id, :service_id]])
    end
end
