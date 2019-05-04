import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

import datetime as dt

engine = create_engine("sqlite:///Resources/hawaii.sqlite")


Base = automap_base()

Base.prepare(engine, reflect=True)

Measurement = Base.classes.measurement
Station = Base.classes.station

session = Session(engine)

app = Flask(__name__)

@app.route("/")
def welcome():
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/(start date)<br/>"
        f"/api/v1.0/(start date)/(end date)"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
	rain_data = session.query(Measurement.date, func.max(Measurement.prcp)).group_by(Measurement.date)

	rain_dict= {}

	for day, rain in rain_data:
		rain_dict[day] = rain

	return jsonify(rain_dict)


@app.route("/api/v1.0/stations")
def stations():
	station_data = session.query(Station.station)
	station_list = []

	for stations in station_data:
		station_list.append(stations.station)

	return jsonify(station_list)

@app.route("/api/v1.0/tobs")
def tobs():
	day = session.query(func.max(Measurement.date)).scalar()
	max_date = dt.datetime.strptime(day, '%Y-%m-%d')

	temps = session.query(Measurement.date, func.max(Measurement.tobs)).\
    	group_by(Measurement.date).filter(Measurement.date >= max_date - dt.timedelta(365))

	temp_dict = {}

	for day, temp in temps:
		temp_dict[day] = temp

	return jsonify(temp_dict)


@app.route("/api/v1.0/<start>")
def temperature_data_start(start):
	temp_data = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
		filter(Measurement.date >= start)

	temp_dict = {}

	for TMIN, TAVG, TMAX in temp_data:
		temp_dict['TMIN'] = TMIN
		temp_dict['TAVG'] = TAVG
		temp_dict['TMAX'] = TMAX
    
	return jsonify(temp_dict)

@app.route("/api/v1.0/<start>/<end>")
def temperature_data_start_end(start, end):
	temp_data = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
		filter(Measurement.date >= start).filter(Measurement.date <= end)

	temp_dict = {}

	for TMIN, TAVG, TMAX in temp_data:
		temp_dict['TMIN'] = TMIN
		temp_dict['TAVG'] = TAVG
		temp_dict['TMAX'] = TMAX
    
	return jsonify(temp_dict)

if __name__ == "__main__":
    app.run(debug=True)

