import {Link} from 'react-router-dom'
import {IoStarSharp} from 'react-icons/io5'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {jobData} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <Link className="links" to={`/jobs/${id}`}>
      <li className="joblistItem">
        <div className="logoandName">
          <img
            className="jobitemlogo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="NameAndStars">
            <h1 className="JobName">{title}</h1>
            <p className="stars">
              <IoStarSharp className="starLogo" />
              {rating}
            </p>
          </div>
        </div>

        <div className="locationandTypeandsalary">
          <div className="locationAndType">
            <p className="locationPara">
              <MdLocationOn className="locationIcon" />
              {location}
            </p>

            <p className="locationPara">
              <BsFillBriefcaseFill className="locationIcon" />
              {employmentType}
            </p>
          </div>
          <p className="salary">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <div className="descCOntainer">
          <h1 className="descHEading">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
