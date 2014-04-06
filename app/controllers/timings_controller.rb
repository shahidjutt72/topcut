class TimingsController < ApplicationController
  before_action :set_timing, only: [:show, :edit, :update, :destroy]

  # GET /timings
  # GET /timings.json
  def index
    @timings = Timing.all
  end

  # GET /timings/1
  # GET /timings/1.json
  def show
  end

  # GET /timings/new
  def new
    @timing = Timing.new
  end

  # GET /timings/1/edit
  def edit
  end

  # POST /timings
  # POST /timings.json
  def create
    @timing = Timing.new(timing_params)

    respond_to do |format|
      if @timing.save
        format.html { redirect_to @timing, notice: 'Timing was successfully created.' }
        format.json { render action: 'show', status: :created, location: @timing }
      else
        format.html { render action: 'new' }
        format.json { render json: @timing.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /timings/1
  # PATCH/PUT /timings/1.json
  def update
    respond_to do |format|
      if @timing.update(timing_params)
        format.html { redirect_to @timing, notice: 'Timing was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @timing.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /timings/1
  # DELETE /timings/1.json
  def destroy
    @timing.destroy
    respond_to do |format|
      format.html { redirect_to timings_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_timing
      @timing = Timing.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def timing_params
      params.require(:timing).permit(:sun_opening_time, :sun_closing_time, :is_on_sun, :mon_opening_time, :mon_closing_time, :is_on_mon, :tue_opening_time, :tue_closing_time, :is_on_tue, :wed_opening_time, :wed_closing_time, :is_on_wed, :thu_opening_time, :thu_closing_time, :is_on_thu, :fri_opening_time, :fri_closing_time, :is_on_fri, :sat_opening_time, :sat_closing_time, :is_on_sat, :company_id)
    end
end
