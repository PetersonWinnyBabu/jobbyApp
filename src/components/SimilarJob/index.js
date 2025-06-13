import {IoStarSharp} from 'react-icons/io5'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJob = props => {
  const {similarJobDetaails} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,

    rating,
    title,
  } = similarJobDetaails

  return (
    <li className="simjoblistItem">
      <div className="simlogoandName">
        <img
          className="simjobitemlogo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="simNameAndStars">
          <h1 className="simJobName">{title}</h1>
          <p className="stars">
            <IoStarSharp className="starLogo" />
            {rating}
          </p>
        </div>
      </div>

      <div className="simdescContainer">
        <h1 className="simdescHEading">Description</h1>
        <p className="simdescription">{jobDescription}</p>
      </div>

      <div className="simlocationandTypeandsalary">
        <div className="simlocationAndType">
          <p className="simlocationPara">
            <MdLocationOn className="simlocationIcon" />
            {location}
          </p>

          <p className="simlocationPara">
            <BsFillBriefcaseFill className="simlocationIcon" />
            {employmentType}
          </p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
