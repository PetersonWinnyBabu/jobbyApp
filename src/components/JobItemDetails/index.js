import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoStarSharp} from 'react-icons/io5'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {GoLinkExternal} from 'react-icons/go'
import Header from '../Header'
import SimilarJob from '../SimilarJob'
import SkillsItem from '../SkillsItem'
import './index.css'

const apiStatusVariables = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsData: {},
    similarJobsData: [],
    lifeAtCompanyDetails: [],
    apiStatus: apiStatusVariables.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getSimilarJobs = jobs => ({
    companyLogoUrl: jobs.company_logo_url,
    employmentType: jobs.employment_type,
    id: jobs.id,
    jobDescription: jobs.job_description,
    location: jobs.location,
    rating: jobs.rating,
    title: jobs.title,
  })

  getSkills = skill => ({imageUrl: skill.image_url, name: skill.name})

  getLifeAtCompany = lacompany => ({
    descriptionlacompany: lacompany.description,
    imageUrllacompany: lacompany.image_url,
  })

  getJobDetailsData = jobItems => ({
    companyLogoUrl: jobItems.company_logo_url,
    companyWebsiteUrl: jobItems.company_website_url,
    employmentType: jobItems.employment_type,
    id: jobItems.id,
    jobDescription: jobItems.job_description,
    skills: jobItems.skills.map(eachSkill => this.getSkills(eachSkill)),
    lifeAtCompany: this.getLifeAtCompany(jobItems.life_at_company),
    location: jobItems.location,
    packagePerAnnum: jobItems.package_per_annum,
    rating: jobItems.rating,
    title: jobItems.title,
  })

  onFailureApiCall = () => {
    this.setState({apiStatus: apiStatusVariables.failure})
  }

  onSucessApicall = data => {
    const updatedJobDetails = this.getJobDetailsData(data.job_details)
    const updatedSimilarJobDetails = data.similar_jobs.map(eachJOb =>
      this.getSimilarJobs(eachJOb),
    )

    this.setState({
      jobDetailsData: updatedJobDetails,
      similarJobsData: updatedSimilarJobDetails,
      lifeAtCompanyDetails: updatedJobDetails.lifeAtCompany,

      apiStatus: apiStatusVariables.success,
    })
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusVariables.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok) {
      this.onSucessApicall(data)
    } else {
      this.onFailureApiCall()
    }
  }

  renderItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusVariables.loading:
        return this.renderLoader()
      case apiStatusVariables.success:
        return this.renderjobDetailsCard()
      case apiStatusVariables.failure:
        return this.renderFailurePage()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailurePage = () => (
    <div className="errorItem">
      <img
        className="errorimage"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="errorHeading">Oops! Something Went Wrong</h1>
      <p className="errorpara">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retryButton"
        type="button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderjobDetailsCard = () => {
    const {jobDetailsData, similarJobsData, lifeAtCompanyDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
    } = jobDetailsData

    const {descriptionlacompany, imageUrllacompany} = lifeAtCompanyDetails
    console.log(skills)

    return (
      <div className="jobDetailsCOntainer">
        <div className="joblistItemCard">
          <div className="logoandName">
            <img
              className="jobitemlogo"
              src={companyLogoUrl}
              alt="job details company logo"
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
            <div className="descandLink">
              <h1 className="descHEading">Description</h1>
              <a
                href={companyWebsiteUrl}
                className="externalLink"
                target="__blank"
              >
                Visit <GoLinkExternal />
              </a>
            </div>
            <p className="description">{jobDescription}</p>
          </div>
          <h1 className="skillHeading">Skills</h1>
          <ul className="skillsCOntainer">
            {skills.map(eackSkill => (
              <SkillsItem key={eackSkill.name} eachSkillDetail={eackSkill} />
            ))}
          </ul>
          <h1 className="lifeatCompany">Life at Company</h1>
          <div className="lifeatcompanydescandimage">
            <div className="lifeatCompanyDesc">
              <p className="lifeatCompanyDescpara">{descriptionlacompany}</p>
            </div>
            <img
              className="lifeatCompanyDescImage"
              src={imageUrllacompany}
              alt="life at company"
            />
          </div>
        </div>
        <div className="similarJobareaContainer">
          <h1 className="similarJobarea">Similar Jobs</h1>
          <ul className="similarJobItemContainer">
            {similarJobsData.map(eachSimilarJob => (
              <SimilarJob
                similarJobDetaails={eachSimilarJob}
                key={eachSimilarJob.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="jobItemDetailsBackground">
        <Header />
        {this.renderItems()}
      </div>
    )
  }
}
export default JobItemDetails
